async function signup() {
  setMessage("");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) setMessage(error.message);
  else setMessage("Check your email to confirm your account, then log in.");
}
