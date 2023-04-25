import React, { FC, ReactNode } from 'react';

import cn from 'classnames';
import s from './TitleView.module.css';

interface TitleViewProps {
  children: ReactNode;
  className?: string;
}

const TitleView: FC<TitleViewProps> = ({ children, className }) => {
  return (
    <div className={cn(s.title, className)}>
      <div className={s.line}></div>
      <h2>{children}</h2>
      <div className={s.line}></div>
    </div>
  );
};

export default TitleView;
