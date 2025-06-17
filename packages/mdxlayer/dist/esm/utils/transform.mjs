import fs from 'node:fs';
import path from 'node:path';

const transformFile = ({
  doc,
  subpath,
  filename
}) => {
  const outputPath = path.resolve(
    process.cwd(),
    `.mdxlayer/${subpath}`,
    filename
  );
  const content = typeof doc === "string" ? doc : JSON.stringify(doc, null, 2);
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
};

export { transformFile };
