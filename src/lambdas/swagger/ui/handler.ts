import { formatHTML } from '@utils/api-gateway';
import { middify } from '@utils/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="SwaggerUI"
  />
  <title>SwaggerUI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js" crossorigin></script>
<script defer>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: window.location.href + '.json',
      dom_id: '#swagger-ui',
    });
  };
</script>
</body>
</html>
`;

const swaggerUI: APIGatewayProxyHandler = async (_) => {
  return formatHTML(html);
};

export const main = middify(swaggerUI);
