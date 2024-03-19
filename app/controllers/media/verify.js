import fs from "fs/promises";
import { findPropertiesWithKey } from "../../../../../ecommerce/app/utils/functions.js";

export const verifyVideo = async (videoUrl) => {
  const videoName = videoUrl.substring(
    process.env.HOST.length + 8,
    videoUrl.length
  );
  const sourcePath = `${process.env.BASE_VIDEOS_DIRECTORY}/invalid/${videoName}`;
  const destinationPath = `${process.env.BASE_VIDEOS_DIRECTORY}/valid/${videoName}`;
  try {
    await fs.stat(`${process.env.BASE_IMAGES_DIRECTORY}/valid/`);
  } catch (_) {
    await fs.mkdir(`${process.env.BASE_IMAGES_DIRECTORY}/valid/`, {
      recursive: true,
    });
  }
  await fs.rename(sourcePath, destinationPath);
};

export const verifyImage = async (imageUrl) => {
  const imageName = imageUrl.substring(
    process.env.HOST.length + 8,
    imageUrl.length
  );
  const sourcePath = `${process.env.BASE_IMAGES_DIRECTORY}/invalid/${imageName}`;
  const destinationPath = `${process.env.BASE_IMAGES_DIRECTORY}/valid/${imageName}`;
  try {
    await fs.stat(`${process.env.BASE_IMAGES_DIRECTORY}/valid/`);
  } catch (_) {
    await fs.mkdir(`${process.env.BASE_IMAGES_DIRECTORY}/valid/`, {
      recursive: true,
    });
  }
  fs.rename(sourcePath, destinationPath).then().catch((e)=> {});
};

export const verifyMediaInBody = (body) => {
  const images = findPropertiesWithKey(body, "image");
  const icons = findPropertiesWithKey(body, "icon");

  ///Verify images
  for (let i = 0; i < images.length; i++) {
    let imageUrl = images[i];
    imageUrl = imageUrl.value;

    if (Array.isArray(imageUrl)) {
      for (let e = 0; e < imageUrl.length; e++) {
        verifyImage(imageUrl[e]);
      }
    } else {
      verifyImage(imageUrl);
    }
  }

  //Verify icons
  for (let i = 0; i < icons.length; i++) {
    let iconUrl = icons[i];
    iconUrl = iconUrl.value;

    if (Array.isArray(iconUrl)) {
      for (let e = 0; e < iconUrl.length; e++) {
        verifyImage(iconUrl[e]);
      }
    } else {
      verifyImage(iconUrl);
    }
  }
};
