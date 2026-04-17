// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SERVICE_ROLE_KEY") ??
      "";

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Supabase environment variables are not configured");
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const adminUser = userData.user;
    const { data: adminRoles, error: roleError } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUser.id);

    if (roleError) {
      throw new Error(`Unable to verify admin role: ${roleError.message}`);
    }

    const isAdmin = (adminRoles ?? []).some((row) => row.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Only admins can approve farmers" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const { userId } = await req.json();
    if (!userId) {
      throw new Error("Missing userId");
    }

    const { error: profileError } = await adminClient
      .from("profiles")
      .update({ is_verified_supplier: true })
      .eq("user_id", userId);

    if (profileError) {
      throw new Error(`Failed to approve farmer profile: ${profileError.message}`);
    }

    const { error: roleUpsertError } = await adminClient
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role: "farmer",
        },
        {
          onConflict: "user_id,role",
          ignoreDuplicates: true,
        }
      );

    if (roleUpsertError) {
      throw new Error(`Failed to ensure farmer role: ${roleUpsertError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
