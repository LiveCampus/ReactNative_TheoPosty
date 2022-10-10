export const handlePromise = async (promise: Promise<any>) => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

export const errorMessage: { [key in string]: string } = {
  "auth/email-already-in-use": "This email address is already taken",
  "auth/weak-password": "Password should be at least 6 characters",
  "auth/invalid-email": "Please enter a valid email address",
  "auth/user-not-found": "You have entered an invalid email or password",
  "auth/wrong-password": "You have entered an invalid email or password",
  "auth/too-many-requests":
    "You have entered an invalid password too many times, try again later",
  "auth/internal-error": "Please fill out all fields",
};
