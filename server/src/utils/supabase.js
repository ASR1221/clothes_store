const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: {
      persistSession: true,
   },
});
exports.supabase = supabase;