"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBannerPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bannerText, setBannerText] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
      setCroppedImage(null);
    }
  };

  const onCropComplete = useCallback((_: { x: number; y: number }, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!selectedImage || !croppedAreaPixels) return null;

    const image: HTMLImageElement = document.createElement("img");
    image.src = selectedImage;

    await new Promise<void>((resolve) => (image.onload = () => resolve()));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    if (ctx) {
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      });
    }

    return null;
  };

  const handleCropConfirm = async () => {
    const croppedImageBlob = await getCroppedImageBlob();
    if (croppedImageBlob) {
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImage(croppedImageUrl);
      setIsCropping(false);
    } else {
      toast.error("Failed to crop the image.");
    }
  };

  const handleUpload = async () => {
    const croppedImageBlob = await getCroppedImageBlob();

    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append("file", croppedImageBlob, "cropped-banner.jpg");
      formData.append("title", bannerText);

      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/addbanner", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          toast.success("Banner uploaded successfully!");
          setSelectedImage(null);
          setBannerText("");
          setCroppedImage(null);
        } else {
          toast.error("Failed to upload banner.");
        }
      } catch {
        toast.error("Error uploading banner.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Failed to crop the image.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6 text-center sm:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Add a New Banner
      </motion.h1>
      <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input w-full border border-gray-300 rounded p-2"
        />
      </div>
      {selectedImage && isCropping && (
        <motion.div
          className="relative mt-6 bg-white p-4 rounded shadow-md w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Crop Image</h2>
          <div className="relative w-full h-72 md:h-96 bg-gray-200 rounded overflow-hidden">
            <Cropper
              image={selectedImage}
              crop={crop}
              zoom={zoom}
              aspect={16 / 6}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between mt-4">
            <button
              onClick={() => {
                setSelectedImage(null);
                setCroppedImage(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mb-2 sm:mb-0"
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
      {croppedImage && !isCropping && (
        <motion.div
          className="mt-6 w-full max-w-4xl bg-white p-6 rounded shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Cropped Image Preview</h2>
          <div className="mb-4">
            <Image
              src={croppedImage}
              alt="Cropped Preview"
              width={192}
              height={96}
              className="w-48 h-24 object-cover rounded mx-auto"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Add Banner Text</h2>
          <input
            type="text"
            placeholder="Enter Banner Text or Offer"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpload}
              className="bg-green-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-green-600 transition w-full sm:w-auto"
            >
              Save Banner
            </button>
            <button
              onClick={() => {
                setCroppedImage(null);
                setSelectedImage(null);
                setIsCropping(true);
              }}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded shadow hover:bg-gray-600 w-full sm:w-auto"
            >
              Change Image
            </button>
          </div>
        </motion.div>
      )}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddBannerPage;
