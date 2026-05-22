const sharp = require('sharp');

async function main() {
  const original = '/Users/prakhar/.gemini/antigravity-ide/brain/51bf19cc-2731-4746-8c00-d06d0611a7d1/e_akhbar_1920_1779488409353.png';
  
  try {
    const resized = await sharp(original).resize(1080, 1080).toBuffer();
    
    // Extract the right-most column of pixels
    const column = await sharp(resized).extract({ left: 1079, top: 0, width: 1, height: 1080 }).toBuffer();
    
    // Stretch it horizontally to 840px width
    const stretchedRight = await sharp(column).resize(840, 1080, { fit: 'fill' }).toBuffer();
    
    // Composite into final 1920x1080 canvas
    await sharp({
      create: { width: 1920, height: 1080, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } }
    })
    .composite([
      { input: resized, left: 0, top: 0 },
      { input: stretchedRight, left: 1080, top: 0 }
    ])
    .toFile('/Users/prakhar/Projects/modern news app/frontend/public/auth-illustration.png');
    
    console.log("Success! Created perfect 1920x1080 image.");
  } catch (err) {
    console.error(err);
  }
}
main();
