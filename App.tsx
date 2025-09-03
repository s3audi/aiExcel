

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TableRow, Link, Product, ColumnMapping } from './types';
import { parseExcelFile, SheetData } from './services/excelService';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { FilterControls } from './components/FilterControls';
import { SheetSelector } from './components/SheetSelector';
import { LinkSelector } from './components/LinkSelector';
import { LinkManager } from './components/LinkManager';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { ColumnMapper } from './components/ColumnMapper';

export type ProductListName = 'main' | 'data1' | 'data2' | 'data3';
export type Page = 'products' | 'favorites' | 'data1' | 'data2' | 'data3';

// Let TypeScript know that XLSX is available globally
declare const XLSX: any;

const initialProductLists: Record<ProductListName, Product[]> = {
  main: [],
  data1: [],
  data2: [],
  data3: [],
};

const initialColumnMapping: ColumnMapping = {
    barcode: null, description: null, price: null, commission: null, productUrl: null,
    photo1: null, photo2: null, photo3: null,
    data1: null, data2: null, data3: null,
};

const initialColumnMappings: Record<ProductListName, ColumnMapping> = {
    main: { ...initialColumnMapping },
    data1: { ...initialColumnMapping },
    data2: { ...initialColumnMapping },
    data3: { ...initialColumnMapping },
};


const App: React.FC = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState<Page>('products');

  // Excel data state
  const [originalData, setOriginalData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allSheetsData, setAllSheetsData] = useState<Record<string, SheetData>>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  // Links state
  const [links, setLinks] = useState<Link[]>([]);

  // Products state (now supports multiple lists)
  const [productLists, setProductLists] = useState<Record<ProductListName, Product[]>>(initialProductLists);

  // Column Mappings state (one for each list)
  const [columnMappings, setColumnMappings] = useState<Record<ProductListName, ColumnMapping>>(initialColumnMappings);

  const getListNameForPage = useCallback((page: Page): ProductListName | null => {
      if (page === 'products') return 'main';
      if (page === 'data1' || page === 'data2' || page === 'data3') return page;
      return null;
  }, []);

  const activeListName = useMemo(() => getListNameForPage(currentPage), [currentPage, getListNameForPage]);

  const activeColumnMapping = useMemo(() => {
      return activeListName ? columnMappings[activeListName] : initialColumnMapping;
  }, [columnMappings, activeListName]);

  const isMappingComplete = useMemo(() => {
    const mapping = activeColumnMapping;
    return !!mapping.barcode && !!mapping.description && !!mapping.price && !!mapping.commission;
  }, [activeColumnMapping]);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedLinks = localStorage.getItem('excel-tool-links');
      if (savedLinks) setLinks(JSON.parse(savedLinks));

      const savedProductLists = localStorage.getItem('excel-tool-product-lists');
      if (savedProductLists) {
         const parsedLists = JSON.parse(savedProductLists);
         setProductLists({ ...initialProductLists, ...parsedLists });
      }

      const savedMappings = localStorage.getItem('excel-tool-column-mappings');
      if (savedMappings) {
          const parsedMappings = JSON.parse(savedMappings);
          setColumnMappings({ ...initialColumnMappings, ...parsedMappings });
      }

    } catch (e) { console.error("Failed to load from localStorage", e); }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => { localStorage.setItem('excel-tool-links', JSON.stringify(links)); }, [links]);
  useEffect(() => { localStorage.setItem('excel-tool-product-lists', JSON.stringify(productLists)); }, [productLists]);
  useEffect(() => { localStorage.setItem('excel-tool-column-mappings', JSON.stringify(columnMappings)); }, [columnMappings]);

  // Link handlers
  const handleAddLink = (name: string, url: string) => setLinks(prev => [...prev, { name, url }]);
  const handleDeleteLink = (index: number) => {
    if (window.confirm(`'${links[index].name}' adlı bağlantıyı silmek istediğinizden emin misiniz?`)) {
      setLinks(prev => prev.filter((_, i) => i !== index));
    }
  };
  const handleEditLink = (index: number, updatedLink: Link) => {
    setLinks(prev => prev.map((link, i) => i === index ? updatedLink : link));
  };
  
  const createProductFromRow = (row: TableRow): Product | null => {
      if (!isMappingComplete || !activeColumnMapping.barcode) return null;
      
      const barcodeValue = String(row[activeColumnMapping.barcode!]);
      return {
        barcode: barcodeValue,
        description: String(row[activeColumnMapping.description!]),
        price: parseFloat(String(row[activeColumnMapping.price!]).replace(',', '.')) || 0,
        commission: parseFloat(String(row[activeColumnMapping.commission!]).replace(',', '.')) || 0,
        productUrl: activeColumnMapping.productUrl ? String(row[activeColumnMapping.productUrl]) : null,
        photo1: activeColumnMapping.photo1 ? String(row[activeColumnMapping.photo1]) : null,
        photo2: activeColumnMapping.photo2 ? String(row[activeColumnMapping.photo2]) : null,
        photo3: activeColumnMapping.photo3 ? String(row[activeColumnMapping.photo3]) : null,
        data1: activeColumnMapping.data1 ? String(row[activeColumnMapping.data1]) : null,
        data2: activeColumnMapping.data2 ? String(row[activeColumnMapping.data2]) : null,
        data3: activeColumnMapping.data3 ? String(row[activeColumnMapping.data3]) : null,
        cost: 0,
        isFavorite: false,
      };
  }

  // Product handlers
  const handleAddProduct = (row: TableRow) => {
    if (!activeListName) return;
    const newProduct = createProductFromRow(row);
    if (!newProduct) {
        alert("Lütfen en azından Barkod, Açıklama, Fiyat ve Komisyon kolonlarını eşleştirin.");
        return;
    }
    
    const targetList = productLists[activeListName];
    if(targetList.some(p => p.barcode === newProduct.barcode)){
        alert("Bu barkoda sahip bir ürün hedef listede zaten mevcut.");
        return;
    }
    
    setProductLists(prev => ({
        ...prev,
        [activeListName]: [newProduct, ...targetList]
    }));
  };

  const handleAddAllProducts = () => {
    if (!activeListName) return;
    if (!isMappingComplete) {
      alert("Lütfen en azından Barkod, Açıklama, Fiyat ve Komisyon kolonlarını eşleştirin.");
      return;
    }
    if (filteredData.length === 0) return;

    const targetList = productLists[activeListName];
    const existingBarcodes = new Set(targetList.map(p => p.barcode));
    const newProducts: Product[] = [];
    let skippedCount = 0;

    filteredData.forEach(row => {
      const product = createProductFromRow(row);
      if (product) {
          if (existingBarcodes.has(product.barcode)) {
            skippedCount++;
          } else {
            newProducts.push(product);
            existingBarcodes.add(product.barcode);
          }
      }
    });

    if (newProducts.length > 0) {
      setProductLists(prev => ({
          ...prev,
          [activeListName]: [...newProducts, ...targetList]
      }));
    }
    
    alert(`${newProducts.length} yeni ürün listeye eklendi. ${skippedCount} ürün zaten listede olduğu için atlandı.`);
  };
  
  const handleDeleteProduct = (barcode: string) => {
    const productToDelete = Object.values(productLists).flat().find(p => p.barcode === barcode);
    if (productToDelete && window.confirm(`'${productToDelete.description}' adlı ürünü silmek istediğinizden emin misiniz?`)) {
      setProductLists(prev => {
        const newLists = { ...prev };
        for (const key in newLists) {
            newLists[key as ProductListName] = newLists[key as ProductListName].filter(p => p.barcode !== barcode);
        }
        return newLists;
      });
    }
  };
  
  const handleUpdateProductCost = (barcode: string, cost: number) => {
    setProductLists(prev => {
      const newLists = { ...prev };
      for (const key in newLists) {
          newLists[key as ProductListName] = newLists[key as ProductListName].map(p => 
              p.barcode === barcode ? { ...p, cost: isNaN(cost) ? 0 : cost } : p
          );
      }
      return newLists;
    });
  };

  const handleToggleFavorite = (barcode: string) => {
      setProductLists(prev => {
          const newLists = { ...prev };
          for (const key in newLists) {
              newLists[key as ProductListName] = newLists[key as ProductListName].map(p => 
                  p.barcode === barcode ? { ...p, isFavorite: !p.isFavorite } : p
              );
          }
          return newLists;
      });
  };

  const handleExportAllData = () => {
    const allProducts = Object.values(productLists).flat();
    if (allProducts.length === 0 && links.length === 0) {
      alert("Dışa aktarılacak veri bulunmuyor.");
      return;
    }
    const allData = { productLists, links };
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'excel-araci-veri-yedegi.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAllData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);

      const hasProductLists = importedData.productLists && typeof importedData.productLists === 'object';
      const hasLinks = importedData.links && Array.isArray(importedData.links);
      
      let importSummary = [];

      if (hasProductLists) {
          const newProductLists = { ...initialProductLists };
          for(const listName in newProductLists) {
              const key = listName as ProductListName;
              const existingProducts = new Map((productLists[key] || []).map(p => [p.barcode, p]));
              const importedProducts = importedData.productLists[key] || [];
              
              importedProducts.forEach((p: Product) => {
                  if(p.barcode) {
                      existingProducts.set(p.barcode, {
                          ...p, cost: p.cost || 0, isFavorite: p.isFavorite || false, data1: p.data1 || null,
                          data2: p.data2 || null, data3: p.data3 || null,
                      });
                  }
              });
              newProductLists[key] = Array.from(existingProducts.values());
          }
          setProductLists(newProductLists);
          const totalImported = Object.values(importedData.productLists).flat().length;
          importSummary.push(`${totalImported} ürün`);
      }

      if (hasLinks) {
        setLinks(prevLinks => {
          const linkMap = new Map(prevLinks.map(l => [l.url, l]));
          importedData.links.forEach((l: Link) => { if (l.url && l.name) linkMap.set(l.url, l); });
          return Array.from(linkMap.values());
        });
        importSummary.push(`${importedData.links.length} bağlantı`);
      }
      
      alert(`${importSummary.join(' ve ')} başarıyla içe aktarıldı/güncellendi.`);

    } catch (err) { alert("Dosya içe aktarılırken bir hata oluştu: " + (err as Error).message); } 
    finally { event.target.value = ''; }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true); setError(null); setSearchTerm('');
    setOriginalData([]); setFilteredData([]); setHeaders([]);
    setAllSheetsData({}); setSheetNames([]); setSelectedSheet(null);
    
    try {
      const { sheetNames: parsedSheetNames, sheets: parsedSheets } = await parseExcelFile(file);
      setSheetNames(parsedSheetNames);
      setAllSheetsData(parsedSheets);
      if (parsedSheetNames.length > 0) setSelectedSheet(parsedSheetNames[0]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };
  
  const handleExportFilteredData = () => {
    if (filteredData.length === 0) return;
    try {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        const sheetName = selectedSheet ? selectedSheet.replace(/[/\\?*:[\]]/g, '').substring(0, 30) : 'Veri';
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `filtrelenmis-${selectedSheet || 'veri'}.xlsx`);
    } catch (err) { setError("Veri dışa aktarılırken bir hata oluştu."); }
  };

  useEffect(() => {
    if (selectedSheet && allSheetsData[selectedSheet]) {
      const { headers: newHeaders, data: newData } = allSheetsData[selectedSheet];
      setHeaders(newHeaders);
      setOriginalData(newData);
      setSearchTerm('');
    } else {
      setHeaders([]);
      setOriginalData([]);
    }
  }, [selectedSheet, allSheetsData]);

  useEffect(() => {
    if (!searchTerm) { setFilteredData(originalData); return; }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = originalData.filter((row) => 
      Object.values(row).some((value) => String(value).toLowerCase().includes(lowercasedFilter))
    );
    setFilteredData(filtered);
  }, [searchTerm, originalData]);

  const favoritesList = useMemo(() => {
      return Object.values(productLists).flat().filter(p => p.isFavorite);
  }, [productLists]);

  const handleColumnMappingChange = (newMapping: ColumnMapping) => {
      if(activeListName) {
          setColumnMappings(prev => ({
              ...prev,
              [activeListName]: newMapping
          }));
      }
  };
  
  const renderDataWorkspace = (listName: ProductListName, listTitle: string) => (
      <>
        <main className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
          <FileUpload onFileSelect={handleFileChange} isLoading={isLoading} />
          {error && <div className="mt-6 p-4 text-center text-red-300 bg-red-900/50 rounded-lg"><strong>Hata:</strong> {error}</div>}

          {sheetNames.length > 0 && !isLoading && (
            <div className="mt-8">
              <SheetSelector sheetNames={sheetNames} selectedSheet={selectedSheet} onSheetSelect={setSelectedSheet} />
              
              {headers.length > 0 && <ColumnMapper headers={headers} mapping={activeColumnMapping} onMappingChange={handleColumnMappingChange} />}
              {originalData.length > 0 ? (
                <>
                  <FilterControls searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} recordCount={filteredData.length} onExport={handleExportFilteredData} isDataLoaded={originalData.length > 0} onAddAll={handleAddAllProducts} isMappingComplete={isMappingComplete} />
                  <DataTable headers={headers} data={filteredData} onAddProduct={handleAddProduct} isMappingComplete={isMappingComplete} />
                </>
              ) : (<div className="text-center py-10 px-4 bg-slate-800 rounded-lg mt-6"><p className="text-slate-400">Bu sayfada veri yok.</p></div> )}
            </div>
          )}
        </main>
        <div className="mt-8">
            <ProductList 
                products={productLists[listName]} 
                listTitle={`Kaydedilmiş Ürünler: ${listTitle}`}
                onDeleteProduct={handleDeleteProduct} 
                onUpdateProductCost={handleUpdateProductCost} 
                onToggleFavorite={handleToggleFavorite}
                onExport={handleExportAllData} 
                onImport={handleImportAllData} 
            />
        </div>
      </>
  );

  const pageTitles: Record<Page, string> = {
      products: 'Ana Liste',
      favorites: 'Favori Ürünler',
      data1: 'Veri 1 Listesi',
      data2: 'Veri 2 Listesi',
      data3: 'Veri 3 Listesi'
  };

  const isWorkspacePage = activeListName !== null;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-start mb-4">
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <LinkSelector links={links} />
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
            Gelişmiş Veri Aracı
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            {pageTitles[currentPage]}: Excel'den veri aktarın ve listelerinizi yönetin.
          </p>
        </header>
        
        {isWorkspacePage && activeListName ? renderDataWorkspace(activeListName, pageTitles[currentPage]) : null}
        
        {currentPage === 'favorites' && (
             <ProductList 
                products={favoritesList} 
                listTitle={pageTitles.favorites}
                onDeleteProduct={handleDeleteProduct} 
                onUpdateProductCost={handleUpdateProductCost} 
                onToggleFavorite={handleToggleFavorite}
                onExport={handleExportAllData} 
                onImport={handleImportAllData} 
            />
        )}
        
        <LinkManager links={links} onAddLink={handleAddLink} onEditLink={handleEditLink} onDeleteLink={handleDeleteLink} />

        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Gelişmiş Excel Aracı. Tüm Hakları Saklıdır.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
