const fs = require('fs');
const path = require('path');
const envFile = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    process.env[key] = rest.join('=');
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

;(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'password',
  });

  console.log(JSON.stringify(
    {
      success: !error,
      data,
      error: error ? { message: error.message, status: error.status, statusText: error.statusText } : null,
    },
    null,
    2,
  ));
})();
