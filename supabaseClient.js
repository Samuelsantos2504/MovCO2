// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hwymqoupxbyrxfwemauj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eW1xb3VweGJ5cnhmd2VtYXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTIxOTQsImV4cCI6MjA2MTA4ODE5NH0.SAjBljGJXJneze78XlpV45Ah8FDzJZ88p52T-VgB9ug";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
