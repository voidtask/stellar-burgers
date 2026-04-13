import { FC, SyntheticEvent, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  fetchRegisterUser,
  getUserThunk,
  removeErrorText,
  selectLoading,
  selectErrorText
} from '../../slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { useForm } from '../../hooks/use-form';
import { TRegisterData } from '@api';

export const Register: FC = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectErrorText);

  const { values, handleChange } = useForm<TRegisterData>({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchRegisterUser(values)).then(() => dispatch(getUserThunk()));
  };

  useEffect(() => {
    dispatch(removeErrorText());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={values.email}
      userName={values.name}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
