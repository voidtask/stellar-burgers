import { PageUIProps } from '../common-type';

export type ForgotPasswordUIProps = Omit<PageUIProps, 'setEmail'> & {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
