import { useState } from 'react';
import styles from './SignUp.module.css';
import { Form, Link, useActionData } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../SignIn/SignIn';

function SignUp() {
  const [error, setError] = useState(null);
  const actionData = useActionData();
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  function handleVisibility() {
    setIsVisiblePassword((prev) => !prev);
  }
  return (
    <div className={styles.formContainer}>
      <Link className={styles.linkColor} to="/main">Back to Main</Link>
      <h1>Sign Up</h1>
      {actionData?.error && <p style={{ color: 'red' }}>{actionData.error}</p>}
      <Form method="post">
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email address</label>
          <input type="email" name="email" id="email" required />
          {error?.email && <p className={styles.error}>{error.email}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordContainer}>
            <input
              className={styles.passwordField}
              type={isVisiblePassword ? 'text' : 'password'}
              name="password"
              id="password"
              required
              autoComplete="off"
              autoCapitalize="off"
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={handleVisibility}
            >
              {isVisiblePassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button className={styles.submitBtn} type="submit">Sign Up</button>
      </Form>
      <p>
        Already have an account? <Link to="/sign-in">Sign In</Link>
      </p>
    </div>
  );
}

export default SignUp;
