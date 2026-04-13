import { PageUIProps } from '../common-type';

export type LoginUIProps = Omit<PageUIProps, 'setEmail'> & {
  password: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
