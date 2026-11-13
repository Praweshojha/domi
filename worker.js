import { onRequestPost } from './functions/api/contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle Contact API Form POST
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        return await onRequestPost({ request, env, ctx });
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: 'Internal server error processing contact message.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Serve static assets from frontend/public
    try {
      const response = await env.ASSETS.fetch(request);
      if (response && response.status < 400) {
        return response;
      }
      if (url.pathname.includes('favicon')) {
        return new Response(null, { status: 204 });
      }
      return response;
    } catch (err) {
      if (url.pathname.includes('favicon')) {
        return new Response(null, { status: 204 });
      }
      return new Response('Not found', { status: 404 });
    }
  },
};
