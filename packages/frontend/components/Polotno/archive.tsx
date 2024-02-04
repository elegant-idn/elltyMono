{
  /* <div key={nanoid(5)} className={s.sliderItem}>
  <img
    src={src}
    draggable
    onClick={async () => {
      const { width, height } = await getImageSize(url);

      // store.activePage.addElement({
      //   type: 'image',
      //   src: url,
      //   x: store.width / 2 - width / 2,
      //   y: store.height / 2 - height / 2,
      //   width: width,
      //   height: height,
      // });

      // store.activePage.addElemets({type: "svg"})

      store.activePage.addElement({ type: 'star', radius: 100, fill: 'red' });
    }}
    onDragStart={async () => {
      const { width, height } = await getImageSize(src);

      unstable_registerNextDomDrop((pos, element) => {
        // "pos" - is relative mouse position of drop
        // "element" - is element from your store in case when DOM object is dropped on another element

        // you can just create new element on drop position
        // or you can update existing element
        // for example we can drop image from side panel into existing 'image' element in the workspace
        if (element && element.type === 'image') {
          // you can update any property you want, src, clipSrc, border, etc
          element.set({ src: src });
          console.log('we are here');
          return;
        }
        // or we can just create a new element
        store.activePage.addElement({
          type: 'svg',
          src: src,
          x: pos.x,
          y: pos.y,
          width,
          height,
        });
      });
    }}
    onDragEnd={() => {
      unstable_registerNextDomDrop(null);
    }}
    alt="element item"
  />
</div> */
}

// return (
//   <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//     <InputGroup
//       leftIcon="search"
//       placeholder="Search..."
//       onChange={(e) => {
//         loadImages();
//       }}
//       style={{
//         marginBottom: '20px',
//       }}
//     />
//     <p>Demo images: </p>
//     {/* you can create yur own custom component here */}
//     {/* but we will use built-in grid component */}
//     <ImagesGrid
//       images={images}
//       getPreview={(image) => image.url}
//       onSelect={async (image, pos) => {
//         const { width, height } = await getImageSize(image.url);
//         store.activePage.addElement({
//           type: 'image',
//           src: image.url,
//           width,
//           height,
//           // if position is available, show image on dropped place
//           // or just show it in the center
//           x: pos ? pos.x : store.width / 2 - width / 2,
//           y: pos ? pos.y : store.height / 2 - height / 2,
//         });
//       }}
//       rowsNumber={2}
//       isLoading={!images.length}
//       loadMore={false}
//     />
//   </div>
// );

let a;
export default a = 0;
