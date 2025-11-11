import { useEffect, useState } from "react";
import ReactImageUploading from "react-images-uploading";
import { RefreshCwIcon, Trash } from "lucide-react";

function UploadImage({ images, setImages, maxNumber = 5 }) {
  const [localImages, setLocalImages] = useState([]);

  useEffect(() => {
    if (images) {
      setLocalImages(images);
    }
  }, [images]);

  const handleImageChange = (imageList) => {
    setLocalImages(imageList);
    const urls = imageList.map((image) => image);
    setImages(urls);
  };

  return (
    <ReactImageUploading
      multiple
      value={localImages}
      onChange={handleImageChange}
      maxNumber={maxNumber}
      acceptType={["jpg", "png", "jpeg"]}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        <div className="upload__image">
          <button
            className="text-center bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-4 w-full"
            style={isDragging ? { color: "red" } : undefined}
            onClick={onImageUpload}
            {...dragProps}
          >
            Click or Arrastra y suelta aqui
          </button>

          <div className="grid md:grid-cols-4 gap-4 mt-4">
            {imageList.map((image, index) => {
              return (
                <div key={index} className="relative">
                  <img src={image.data_url ?? image} alt="" />

                  <div className="absolute top-0 right-0 flex gap-1 p-1">
                    <button onClick={() => onImageUpdate(index)} size="sm">
                      <RefreshCwIcon className="w-4 h-4" />
                    </button>

                    <button onClick={() => onImageRemove(index)} size="sm">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ReactImageUploading>
  );
}

export default UploadImage;
