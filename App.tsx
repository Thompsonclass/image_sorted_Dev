import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile } from './types';
import ImageGrid from './components/ImageGrid';
import ActionButton from './components/ActionButton';
import ImageModal from './components/ImageModal';
import { 
  SunIcon, MoonIcon, SwapIcon, PlusIcon, SelectAllIcon, 
  DeselectAllIcon, DownloadIcon, ResetIcon, TrashIcon, UploadCloudIcon 
} from './components/Icons';

declare const JSZip: any;
declare const saveAs: any;

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [modalImage, setModalImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const selectionStartPoint = useRef<{ x: number, y: number } | null>(null);
  const uploadGridContainerRef = useRef<HTMLDivElement>(null);
  
  const [swapInputA, setSwapInputA] = useState('');
  const [swapInputB, setSwapInputB] = useState('');
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(image => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);
  
  const sortedImages = sortedIds.map(id => images.find(img => img.id === id)).filter(Boolean) as ImageFile[];

  const handleFilesChange = useCallback((files: FileList) => {
    const newImages = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleImageClick = useCallback((imageId: string) => {
    setSortedIds(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId) 
        : [...prev, imageId]
    );
  }, []);
  
  const handleOpenModal = useCallback((image: ImageFile) => setModalImage(image), []);
  const handleCloseModal = useCallback(() => setModalImage(null), []);
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleClearAll = useCallback(() => {
    images.forEach(image => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setSortedIds([]);
  }, [images]);

  const handleResetSort = useCallback(() => {
    setSortedIds([]);
  }, []);

  const handleRemoveImage = useCallback((imageIdToRemove: string) => {
    const imageToRemove = images.find(img => img.id === imageIdToRemove);
    if (imageToRemove) URL.revokeObjectURL(imageToRemove.previewUrl);
    setImages(prev => prev.filter(img => img.id !== imageIdToRemove));
    setSortedIds(prev => prev.filter(id => id !== imageIdToRemove));
  }, [images]);

  const handleDownload = useCallback(async () => {
    if (sortedIds.length === 0) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      sortedImages.forEach((imageFile, index) => {
        const extension = imageFile.file.name.split('.').pop() || 'jpg';
        const newFileName = `${String(index + 1).padStart(3, '0')}.${extension}`;
        zip.file(newFileName, imageFile.file);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'sorted-images.zip');
    } catch (error) {
      console.error("Failed to create zip file", error);
      alert("ZIP 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  }, [sortedIds, sortedImages]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const handleReorder = useCallback((newSortedIds: string[]) => {
    setSortedIds(newSortedIds);
  }, []);

  const handleSwapImages = useCallback(() => {
    const numA = parseInt(swapInputA, 10);
    const numB = parseInt(swapInputB, 10);

    if (isNaN(numA) || isNaN(numB) || numA === numB) {
      alert("잘못된 번호입니다. 서로 다른 두 개의 숫자를 입력하여 교체하세요.");
      return;
    }
    
    if (numA < 1 || numA > sortedIds.length || numB < 1 || numB > sortedIds.length) {
      alert(`1부터 ${sortedIds.length} 사이의 숫자를 입력해주세요.`);
      return;
    }
    
    const indexA = numA - 1;
    const indexB = numB - 1;

    const newSortedIds = [...sortedIds];
    [newSortedIds[indexA], newSortedIds[indexB]] = [newSortedIds[indexB], newSortedIds[indexA]];
    
    setSortedIds(newSortedIds);
    setSwapInputA('');
    setSwapInputB('');
  }, [swapInputA, swapInputB, sortedIds]);
  
  const allImageIds = images.map(img => img.id);
  const areAllSelected = images.length > 0 && allImageIds.every(id => sortedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSortedIds([]);
    } else {
      setSortedIds(allImageIds);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting || !selectionStartPoint.current) return;
      
      const currentX = e.clientX;
      const currentY = e.clientY;
      
      const x = Math.min(selectionStartPoint.current.x, currentX);
      const y = Math.min(selectionStartPoint.current.y, currentY);
      const width = Math.abs(currentX - selectionStartPoint.current.x);
      const height = Math.abs(currentY - selectionStartPoint.current.y);
      
      setSelectionBox({ x, y, width, height });
    };

    const handleMouseUp = () => {
      if (!isSelecting || !selectionStartPoint.current) return;
      
      setIsSelecting(false);
      selectionStartPoint.current = null;
      
      if (selectionBox && uploadGridContainerRef.current) {
          const selectionRect = {
              left: selectionBox.x,
              top: selectionBox.y,
              right: selectionBox.x + selectionBox.width,
              bottom: selectionBox.y + selectionBox.height,
          };

          const newSelectedIds: string[] = [];
          const imageElements = uploadGridContainerRef.current.querySelectorAll('.image-grid-item');
          
          imageElements.forEach(el => {
              const imgRect = el.getBoundingClientRect();
              const imageId = (el as HTMLElement).dataset.id;

              const intersects = !(selectionRect.right < imgRect.left || 
                                   selectionRect.left > imgRect.right || 
                                   selectionRect.bottom < imgRect.top || 
                                   selectionRect.top > imgRect.bottom);

              if (imageId && intersects) {
                newSelectedIds.push(imageId);
              }
          });

          if (newSelectedIds.length > 0) {
              setSortedIds(prev => Array.from(new Set([...prev, ...newSelectedIds])));
          }
      }
      
      setSelectionBox(null);
    };

    if (isSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, selectionBox]);

  const handleMouseDownOnGrid = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.image-grid-item')) {
      return;
    }
    e.preventDefault();
    selectionStartPoint.current = { x: e.clientX, y: e.clientY };
    setIsSelecting(true);
  };

  return (
    <div className="app-container">
       {isSelecting && selectionBox && (
        <div
          style={{
            position: 'fixed',
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            border: '1px solid #3b82f6',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        />
      )}
       <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFilesChange(e.target.files)}
        className="hidden"
      />
      <header>
        <div>
          <h1>이미지 정렬 프로</h1>
          <p>드래그 앤 드롭으로 이미지를 손쉽게 정리하세요.</p>
        </div>
        <ActionButton onClick={toggleTheme} variant="secondary" className="theme-toggle" aria-label="테마 변경">
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </ActionButton>
      </header>

      <main>
        <div className="card-container">
          <div className="section-header" style={{ marginBottom: 0, alignItems: 'center' }}>
            <div>
              <h2 className="text-xl font-bold">이미지 업로드</h2>
              <p>원하는 순서대로 정렬할 이미지를 추가하세요.</p>
            </div>
             <ActionButton onClick={triggerFileSelect} variant="primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                {images.length > 0 ? '이미지 추가' : '이미지 선택'}
            </ActionButton>
          </div>
        </div>

        {images.length === 0 && (
          <div className="placeholder-full-page" onClick={triggerFileSelect}>
            <div className="placeholder-content">
              <UploadCloudIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-1">클릭하여 이미지 업로드</h3>
              <p className="text-gray-500 dark:text-gray-400">또는 파일을 여기로 드래그 앤 드롭하세요</p>
            </div>
          </div>
        )}
        
        {images.length > 0 && (
          <>
            <div 
              className="card-container" 
              ref={uploadGridContainerRef} 
              onMouseDown={handleMouseDownOnGrid}
              style={{ userSelect: 'none' }}
            >
              <div className="section-header">
                <div>
                  <h2>업로드된 이미지 ({images.length}개)</h2>
                  <p>정렬할 이미지를 클릭하여 선택하세요.</p>
                </div>
                <div className="action-buttons-group">
                  <ActionButton onClick={handleToggleSelectAll} variant="secondary">
                    {areAllSelected ? <DeselectAllIcon className="w-4 h-4 mr-2" /> : <SelectAllIcon className="w-4 h-4 mr-2" />}
                    {areAllSelected ? '전체 선택 해제' : '전체 선택'}
                  </ActionButton>
                  <ActionButton onClick={handleClearAll} variant="danger">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    전체 삭제
                  </ActionButton>
                </div>
              </div>
              <ImageGrid
                images={images}
                sortedIds={sortedIds}
                onImageClick={handleImageClick}
                onRemoveImage={handleRemoveImage}
                onImageZoom={handleOpenModal}
              />
            </div>
            
            <div className="card-container">
              <div className="section-header">
                <div>
                  <h2>정렬된 이미지 미리보기 ({sortedIds.length}개)</h2>
                  <p>드래그 앤 드롭으로 순서를 변경하세요. 준비가 되면 ZIP 파일로 다운로드할 수 있습니다.</p>
                </div>
                {sortedIds.length > 0 && (
                  <div className="action-buttons-group">
                    <ActionButton onClick={handleResetSort} variant="secondary">
                      <ResetIcon className="w-4 h-4 mr-2" />
                      순서 초기화
                    </ActionButton>
                    <ActionButton
                      onClick={handleDownload}
                      disabled={isDownloading}
                      variant="primary"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      {isDownloading ? '압축 중...' : `ZIP으로 다운로드`}
                    </ActionButton>
                  </div>
                )}
              </div>
              {sortedIds.length > 1 && (
                <div className="swap-controls">
                  <input
                    type="number"
                    className="swap-input"
                    placeholder="바꿀 번호"
                    value={swapInputA}
                    onChange={(e) => setSwapInputA(e.target.value)}
                    min="1"
                    max={sortedIds.length}
                    aria-label="첫 번째로 바꿀 이미지 번호"
                  />
                  <SwapIcon className="swap-icon" />
                  <input
                    type="number"
                    className="swap-input"
                    placeholder="대상 번호"
                    value={swapInputB}
                    onChange={(e) => setSwapInputB(e.target.value)}
                    min="1"
                    max={sortedIds.length}
                    aria-label="두 번째로 바꿀 이미지 번호"
                  />
                  <ActionButton 
                    onClick={handleSwapImages} 
                    variant="secondary" 
                    disabled={!swapInputA || !swapInputB}
                  >
                    바꾸기
                  </ActionButton>
                </div>
              )}
              {sortedIds.length > 0 ? (
                <ImageGrid
                  images={sortedImages}
                  sortedIds={sortedIds}
                  onImageClick={handleImageClick}
                  onRemoveImage={handleRemoveImage}
                  onImageZoom={handleOpenModal}
                  showRemoveButton={false}
                  onReorder={handleReorder}
                />
              ) : (
                <div className="placeholder">
                  <p>위 그리드에서 이미지를 선택하여 정렬을 시작하세요.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

       <ImageModal image={modalImage} onClose={handleCloseModal} />
    </div>
  );
}