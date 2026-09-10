import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '@selectors';

export const AppHeader: FC = () => {
  const userData = useSelector(selectUserData);
  return <AppHeaderUI userName={userData ? userData.name : ''} />;
};
