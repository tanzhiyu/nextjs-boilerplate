"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [images, setImages] = useState<Array<{
    id: string;
    download_url: string;
    author: string;
  }>>([]);

  useEffect(() => {
    // 获取图片的函数
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://picsum.photos/v2/list?page=1&limit=10');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Random Images from Picsum
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={image.download_url}
                alt={image.author}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-700 text-center">
                  Photo by <span className="font-semibold">{image.author}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}