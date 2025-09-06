import * as Plot from '@observablehq/plot';
import { Trans, useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';

import PlotFigure from './PlotFigure';

const boulderScores = [
  { score: 12, v: 'VB', font: '2' },
  { score: 18, v: 'VB', font: '2+' },
  { score: 24, v: 'VB+', font: '3' },
  { score: 30, v: 'VB+', font: '3+' },
  { score: 36, v: 'V0-', font: '4' },
  { score: 42, v: 'V0', font: '4+' },
  { score: 48, v: 'V1', font: '5' },
  { score: 54, v: 'V2', font: '5+' },
  { score: 60, v: 'V3', font: '6a' },
  { score: 66, v: 'V3', font: '6a+' },
  { score: 72, v: 'V4', font: '6b' },
  { score: 78, v: 'V4', font: '6b+' },
  { score: 84, v: 'V5', font: '6c' },
  { score: 90, v: 'V5', font: '6c+' },
  { score: 96, v: 'V6', font: '7a' },
  { score: 102, v: 'V7', font: '7a+' },
  { score: 108, v: 'V7', font: '7b' },
  { score: 114, v: 'V8', font: '7b+' },
  { score: 120, v: 'V9', font: '7c' },
  { score: 126, v: 'V10', font: '7c+' },
].map((grade) => ({ ...grade, font: grade.font.toUpperCase() }));

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [query]);

  return matches;
};

export function Cpr({ data }) {
  const { i18n } = useLingui();
  const ascentTypeColorDomain = {
    domain: ['flash', 'redpoint'],
    range: ['#ffd800', '#ff5151'],
  };

  const maxDifficulty = data.reduce(
    (currentMax, datapoint) =>
      datapoint.difficultyMax > currentMax
        ? datapoint.difficultyMax
        : currentMax,
    '2',
  );

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <article>
      <h2>
        <Trans>Poor man's CPR</Trans>
      </h2>
      <p>
        <PlotFigure
          width={isSmallScreen ? undefined : 1200}
          options={{
            figure: true,
            grid: true,
            color: {
              legend: true,
              type: 'categorical',
              ...ascentTypeColorDomain,
            },
            [isSmallScreen ? 'height' : 'width']: 1200,
            [isSmallScreen ? 'y' : 'x']: {
              label: null,
              tickFormat: (d: Date, i) => {
                return i18n
                  .date(d, {
                    month: 'short',
                    ...(i === 0 || d.getUTCMonth() === 0
                      ? { year: 'numeric' }
                      : {}),
                  })
                  .replace(/\s+/g, '\n');
              },
              reverse: isSmallScreen,
              tickRotate: isSmallScreen ? 90 : 0,
            },
            [isSmallScreen ? 'x' : 'y']: {
              ticks: boulderScores
                .filter((grade) => grade.font <= maxDifficulty)
                .map((grade) => grade.score),
              tickFormat: (v) =>
                boulderScores.find(({ score }) => v === score)?.font,
              label: null,
              tickRotate: isSmallScreen ? 90 : 0,
              ...(isSmallScreen && { axis: 'top' }),
            },
            style: {
              fontFamily: 'Inter',
              fontSize: 'var(--step--1)',
            },
            marginLeft: 50,
            marginRight: 50,
            ...(!isSmallScreen && { marginBottom: 50 }),
            ...(isSmallScreen && { marginTop: 50 }),
            marks: [
              Plot[isSmallScreen ? 'rectX' : 'rectY'](data, {
                interval: 'week',
                [isSmallScreen ? 'y' : 'x']: 'created_at',

                [isSmallScreen ? 'x1' : 'y1']: 'numberDifficultyMin',
                [isSmallScreen ? 'x2' : 'y2']: 'numberDifficultyMax',
                fill: 'type',

                title: (d) => {
                  if (d.difficultyMin === d.difficultyMax)
                    return d.difficultyMin;
                  return `${d.difficultyMin} - ${d.difficultyMax}`;
                },

                inset: 1,
                mixBlendMode: 'color-dodge',
              }),
              Plot.frame(),
            ],
          }}
        />
      </p>
    </article>
  );
}
