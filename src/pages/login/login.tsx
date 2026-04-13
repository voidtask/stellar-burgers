import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchLoginUser,
  removeErrorText,
  selectErrorText,
  selectLoading
} from '../../slices/user-slice';
import { Preloader } from '@ui';
import { useForm } from '../../hooks/use-form';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const error = useSelector(selectErrorText);
  const isLoading = useSelector(selectLoading);

  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(removeErrorText());
    dispatch(fetchLoginUser(values));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
