import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../slices/user-slice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user.name} />;
};
