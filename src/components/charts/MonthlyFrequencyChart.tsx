/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { getMonth } from 'date-fns';
import { useDataSourceState } from '../../context/DataSourceContext';
import { IMusicRecordGrid } from '../../models/DataModel';
import { MusicChart } from '../MusicChart';
import { ICommonChartProps } from './CommonChartProps';

const MonthlyFrequencyChart: React.FC<ICommonChartProps> = (props) => {
  const dataSource: IMusicRecordGrid[] = useDataSourceState();
  const selectedYear = props.selectedYear;
  const monthlyFreq = dataSource.reduce((prev: Array<number>, current) => {
    if (
      current.metadata.year === selectedYear.toString() &&
      current.source.date
    ) {
      prev[getMonth(current.source.date)]++;
    }
    return prev;
  }, new Array(12).fill(0));

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Song frequency per month',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Songs',
      },
    },
    series: [
      {
        name: 'Songs',
        type: 'line',
        pointStart: Date.UTC(selectedYear, 0, 1),
        pointIntervalUnit: 'month',
        data: monthlyFreq,
      },
    ],
  };

  return (
    <MusicChart
      styles={css`
        width: 60%;
      `}
      options={options}
    />
  );
};

export default MonthlyFrequencyChart;
