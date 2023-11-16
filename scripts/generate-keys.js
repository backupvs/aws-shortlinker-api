const { generateKeyPair } = require('node:crypto');
const { writeFileSync, existsSync, mkdirSync } = require('node:fs');
const { join } = require('node:path');

const options = {
  modulusLength: 2048,
};

generateKeyPair('rsa', options, (err, publicKey, privateKey) => {
  const keysDir = join(process.cwd(), '.keys');

  const publicKeyPem = publicKey.export({
    type: 'spki',
    format: 'pem',
  });

  const privateKeyPem = privateKey.export({
    type: 'pkcs8',
    format: 'pem',
  });

  if (!existsSync(keysDir)) {
    mkdirSync(keysDir);
  }

  try {
    writeFileSync(join(keysDir, 'private.pem'), privateKeyPem, { flag: 'wx' });
    writeFileSync(join(keysDir, 'public.pem'), publicKeyPem, { flag: 'wx' });
    console.log(`Keys has been generated and saved to ${keysDir}`);
  } catch (err) {
    if (err.errno && err.errno === -4075) {
      console.error('Keys already exists');
    } else {
      console.error(err);
    }
  }
});
