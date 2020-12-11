import { GetStaticProps } from 'next';
import { Bar } from 'react-chartjs-2';
import fetch from 'node-fetch';

function Chart({ items, step }) {
  console.log({ items });
  const data = {
    labels: [
      ...step.map((s, i) =>
        i === 0 ? (s === 0 ? `${s}` : `〜${s}`) : `${step[i - 1]}〜${s}`,
      ),
      `${step[step.length - 1]}〜`,
    ],
    datasets: [
      {
        label: '件数',
        data: [
          ...step.map(
            (s, i) =>
              items.filter(item =>
                i === 0
                  ? item.value <= s
                  : item.value > step[i - 1] && item.value <= s,
              ).length,
          ),
          items.filter(item => item.value > step[step.length - 1]).length,
        ],
      },
    ],
  };
  return <Bar data={data} />;
}

function Home({ items }) {
  const lcpList = items.filter(item => item.name === 'LCP');
  const clsList = items.filter(item => item.name === 'CLS');
  const fidList = items.filter(item => item.name === 'FID');
  const ttfbList = items.filter(item => item.name === 'TTFB');
  const fcpList = items.filter(item => item.name === 'FCP');

  return (
    <div>
      <div>
        <div>
          <h2>LCP</h2>
          <Chart items={lcpList} step={[1200, 1300, 1400, 1500, 1600, 1700]} />
        </div>
        <div>
          <h2>CLS</h2>
          <Chart items={clsList} step={[0, 0.1, 0.2]} />
        </div>
      </div>
      <div>
        <div>
          <h2>FID</h2>
          <Chart items={fidList} step={[0, 1, 2, 3, 4]} />
        </div>
        <div>
          <h2>TTDFB</h2>
          <Chart items={ttfbList} step={[0, 5, 10, 15]} />
        </div>
      </div>
      <div>
        <div>
          <h2>FCP</h2>
          <Chart items={fcpList} step={[1300, 1400, 1500]} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.API_URL}/analytics`);
  const items = await res.json();
  console.log({ items });
  return { props: { items } };
}

export default Home;
