import fs from 'fs';

const deleteImage = (image: string) => {
  fs.unlink(image, err => {
    if (err) throw new Error(err.message);
  });
};

export default deleteImage;
