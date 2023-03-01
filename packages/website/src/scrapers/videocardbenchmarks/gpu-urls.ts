import axios from 'axios';

const BASE_URL =
  'https://www.videocardbenchmark.net/video_lookup.php?gpu={slug}';
const DATA_URL = 'https://www.videocardbenchmark.net/data?_={timestamp}';

interface VideoBenchmarksData {
  data: {
    id: string;
    name: string;
    cat: string;
    g3d: string;
    g2d: string;
    href: string;
  }[];
}

export async function getVideocardBenchmarksGpuUrls() {
  const response = await fetchData();

  const urls: {
    name: string;
    marketSegment: string;
    g3dMark: number;
    g2dMark: number;
    url: string;
  }[] = [];

  response.data.forEach((gpu) => {
    const name = gpu.name;
    const marketSegment = gpu.cat;
    const g3dMark = Number(gpu.g3d);
    const g2dMark = Number(gpu.g2d);
    const slug = gpu.href.replace('&amp;', '&');
    const url = BASE_URL.replace('{slug}', slug);

    urls.push({ name, marketSegment, g3dMark, g2dMark, url });
  });

  console.log(urls);
}

async function fetchData() {
  const url = buildDataUrl();
  const response = await axios.get(url, {
    headers: {
      Referer: 'https://www.videocardbenchmark.net/GPU_mega_page.html',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
  return response.data as VideoBenchmarksData;
}

function buildDataUrl() {
  return DATA_URL.replace('{timestamp}', `${new Date().getTime()}`);
}
