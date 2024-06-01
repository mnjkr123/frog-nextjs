/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { neynar } from 'frog/hubs';
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge';

app.frame('/', (c) => {
  return c.res({
    action: '/picker',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/site-preview.jpg`,
    intents: [
      <Button value="A">A</Button>,
      <Button value="B">B</Button>,
    ],
  });
});

app.frame('/picker', (c) => {
  const { buttonValue } = c;

  if (buttonValue === 'A') {
    // Show the first Meme
    return c.res({
      action: '/meme/a',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/a`,
      intents: [
        <TextInput placeholder="Text" />,
        <Button value="generate">Generate</Button>,
      ],
    });
  }

  // Show the second Meme
  return c.res({
    action: '/meme/b',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/b`,
    imageAspectRatio: '1:1',
    intents: [
      <TextInput placeholder="Text" />,
      <Button value="generate">Generate</Button>,
    ],
  });
});

app.frame('/meme/:id', (c) => {
  const id = c.req.param('id');
  const { inputText = '' } = c;

  console.log('id', id);
  console.log('inputText', inputText);

  const newSearchParams = new URLSearchParams({
    text: inputText,
  }).toString(); // Ensure it's a string

  console.log('newSearchParams', newSearchParams);

  if (id === 'a') {
    return c.res({
      action: '/',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/a?${newSearchParams}`,
      intents: [<Button>Start Over</Button>],
    });
  }

  return c.res({
    action: '/',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/meme/b?${newSearchParams}`,
    imageAspectRatio: '1:1',
    intents: [<Button>Start Over</Button>],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
