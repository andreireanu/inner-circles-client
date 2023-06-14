import React, { FC, useState, useRef, LegacyRef } from 'react';
import { Card, CardContent } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import useScreen from '../../../../lib/hooks/useScreen';
import { useKeenSlider } from 'keen-slider/react';

import 'keen-slider/keen-slider.min.css';
import cn from 'classnames';
import s from './CompaignsSlider.module.css';
import { Campaign } from '@mui/icons-material';

export interface CompaignsSliderProps {
  compaigns: Array<string>;
  className?: string;
}

const CompaignsSlider: FC<CompaignsSliderProps> = ({
  compaigns,
  className
}) => {
  const screen = useScreen();

  const arrowLeftRef = useRef<HTMLButtonElement>();
  const arrowRightRef = useRef<HTMLButtonElement>();
  const [isMounted, setIsMounted] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: false,
    defaultAnimation: {
      duration: 600
    },
    slides: { perView: screen === 's' ? 1 : 4 },
    created: () => setIsMounted(true)
  });

  if (!compaigns?.length) return null;

  return (
    <section className={cn(s.container, className)}>
      <div className={s.content}>
        {instanceRef &&
          (screen === 's' ? compaigns.length > 1 : compaigns.length > 4) && (
            <>
              <button
                ref={arrowLeftRef as LegacyRef<HTMLButtonElement>}
                className={s.arrowLeft}
                onClick={() => instanceRef.current?.prev()}
                aria-label='Précédent'
              />
              <button
                ref={arrowRightRef as LegacyRef<HTMLButtonElement>}
                className={s.arrowRight}
                onClick={() => instanceRef.current?.next()}
                aria-label={'Suivant'}
              />
            </>
          )}
        <div
          ref={sliderRef}
          className={cn('keen-slider', s.slider, {
            [s.justifyCenter]: screen !== 's' && compaigns.length < 4
          })}
          style={{ overflow: 'visible' }}
        >
          {compaigns?.map((compaign, i) => (
            <div
              key={`compaignsList-${i}`}
              className={cn('keen-slider__slide', s.slide, {
                [s.jsDisabledBlocks]: !isMounted
              })}
            >
              <Card sx={{ mt: 2, width: '100%', maxWidth: 200, height: 200 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {Object.keys(compaign).map((k, j) => (
                    <p key={`compaignsList-${i}-${j}`}>
                      {k} : {compaign[k as any]}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaignsSlider;
