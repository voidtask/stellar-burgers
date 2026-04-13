import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useForm } from '../../hooks/use-form';

export const ForgotPassword: FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const { values, handleChange } = useForm({
    email: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi(values)
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={values.email}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
