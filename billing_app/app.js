const SUPABASE_URL = "https://icbajvpsbiqqbpotwcsd.supabase.co";
const SUPABASE_KEY = "sb_publishable_pJTpG_z7fhZl096K19mznw_K7IJC2uC";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Billing App Supabase client ready");