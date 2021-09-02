import echarts from 'echarts';
import { deepMerge } from '@/utils';

// 基础折线图
class BarGeneral {
  static defaultOptions = {
    itemColors: ['#0078FF', '#3CE658', '#FF6B49', '#F9CF3C'],
    showType: 'value', // value: 值 percentage: 百分比
  };
  constructor(container, options) {
    this.container = container;
    this.options = deepMerge({}, BarGeneral.defaultOptions, options);
  }
  initChart() {
    if (!this.chart) {
      this.chart = echarts.init(this.container);
    }
  }

  updateOptions() {
    const { itemColors, showType } = this.options;
    const sum = this.sum;
    this.data.forEach((item, index) => {
      if (itemColors[index]) {
        item.itemStyle = {};
        item.itemStyle.color = itemColors[index];
      }
    });
    this.chart.setOption({
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: '10%',
        align: 'left',
        bottom: '10%',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
        icon: 'circle',
        width: 30,
        height: 350,
        padding: 0,
        itemHeight: 16,
        itemWidth: 16,
        selectedMode: false,
      },
      series: [
        {
          name: '标题',
          type: 'pie',
          center: ['40%', '50%'],
          radius: ['60%', '90%'],
          clockwise: false, //饼图的扇区是否是顺时针排布
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          emphasis: {
            label: {
              show: true,
              formatter(params) {
                const str =
                  showType === 'value'
                    ? params.value
                    : `${((params.value / sum) * 100).toFixed(1)}%`;
                return `{value|${str}}\n{name|${params.name}}`;
              },
              rich: {
                value: {
                  color: '#ffffff',
                  lineHeight: 80,
                  fontSize: 60,
                },
                name: {
                  fontSize: 20,
                },
              },
              textStyle: {
                fontSize: 20,
                fontWeight: 'bold',
                color: '#ffffff',
              },
            },
          },
          markPoint: {
            symbol: 'rect',
          },
          data: this.data,
        },
      ],
    });
  }

  setData(data) {
    this.data = data;
    this.sum = this.data.map((item) => item.value).reduce((a, b) => a + b);
    this.updateOptions();
  }

  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
}

export default BarGeneral;
