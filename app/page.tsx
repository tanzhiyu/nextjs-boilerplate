"use client";
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [images, setImages] = useState<Array<{
    id: string;
    download_url: string;
    author: string;
  }>>([]); // 存储图片数据
  const [page, setPage] = useState<number>(1); // 当前页码
  const [loading, setLoading] = useState<boolean>(false); // 加载状态
  const loaderRef = useRef(null); // 用于观察的 DOM 元素

  // 获取图片的函数
  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=10`);
      setImages((prevImages) => [...prevImages, ...response.data]); // 追加新图片
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载第一页图片
  useEffect(() => {
    fetchImages(page);
  }, []);

  // 监听滚动到底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1); // 加载下一页
        }
      },
      { threshold: 1.0 } // 当 loader 完全进入视口时触发
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading]);

  // 当页码变化时加载更多图片
  useEffect(() => {
    if (page > 1) {
      fetchImages(page);
    }
  }, [page]);

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
        {/* 加载更多指示器 */}
        <div ref={loaderRef} className="text-center py-6">
          {loading && <p className="text-gray-600">Loading more images...</p>}
        </div>
      </div>
    </div>
  );
}