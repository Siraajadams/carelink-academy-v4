async function register() {
  setMessage("Creating account...");

  try {
    const response = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("FULL RESPONSE:", response);

    if (response.error) {
      setMessage(
        JSON.stringify(response.error, null, 2)
      );
      return;
    }

    setMessage(
      "SUCCESS: " + JSON.stringify(response.data)
    );
  } catch (err: any) {
    console.error(err);
    setMessage(err.message);
  }
}
