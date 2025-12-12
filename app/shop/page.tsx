import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/product-card";
import { FilterHandler } from "@/components/shop/filter-handler";
import { SearchBar } from "@/components/shop/search-bar";
import { SortSelect } from "@/components/shop/sort-select";
import { Decimal } from "@prisma/client/runtime/library";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Helper function to serialize Decimal values
const serializeProduct = (product: any) => ({
  ...product,
  ratingAverage:
    product.ratingAverage instanceof Decimal
      ? product.ratingAverage.toNumber()
      : product.ratingAverage,
  price:
    product.price instanceof Decimal ? product.price.toNumber() : product.price,
  comparePrice:
    product.comparePrice instanceof Decimal
      ? product.comparePrice.toNumber()
      : product.comparePrice,
  costPrice:
    product.costPrice instanceof Decimal
      ? product.costPrice.toNumber()
      : product.costPrice,
});

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  sort?: string;
  q?: string;
}

async function getProducts(searchParams: SearchParams) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(searchParams.category && {
      categoryId: {
        in: searchParams.category.split(","),
      },
    }),
    ...(searchParams.minPrice || searchParams.maxPrice
      ? {
          price: {
            gte: searchParams.minPrice
              ? parseFloat(searchParams.minPrice)
              : undefined,
            lte: searchParams.maxPrice
              ? parseFloat(searchParams.maxPrice)
              : undefined,
          },
        }
      : {}),
    ...(searchParams.q
      ? {
          OR: [
            { name: { contains: searchParams.q, mode: "insensitive" } },
            { description: { contains: searchParams.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
      },
      orderBy:
        searchParams.sort === "price_asc"
          ? { price: "asc" }
          : searchParams.sort === "price_desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // Serialize the products before returning
  const serializedProducts = products.map(serializeProduct);

  return {
    products: serializedProducts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return categories;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { products, total, pages, currentPage } =
    await getProducts(searchParams);
  const categories = await getCategories();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <FilterHandler categories={categories} />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="lg:w-3/4">
          <div className="flex flex-col space-y-4 mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h1 className="text-3xl font-bold">Shop</h1>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <SearchBar />
              <SortSelect defaultValue={searchParams.sort || "newest"} />
            </div>
          </div>

          {total === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No products found</h2>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Suspense fallback={<ProductGridSkeleton />}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={serializeProduct(product)}
                    />
                  ))}
                </Suspense>
              </div>

              {pages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={`/shop?page=${currentPage - 1}${
                              searchParams.sort
                                ? `&sort=${searchParams.sort}`
                                : ""
                            }${
                              searchParams.category
                                ? `&category=${searchParams.category}`
                                : ""
                            }${
                              searchParams.minPrice
                                ? `&minPrice=${searchParams.minPrice}`
                                : ""
                            }${
                              searchParams.maxPrice
                                ? `&maxPrice=${searchParams.maxPrice}`
                                : ""
                            }${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                          />
                        </PaginationItem>
                      )}
                      {Array.from({ length: pages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href={`/shop?page=${page}${
                                searchParams.sort
                                  ? `&sort=${searchParams.sort}`
                                  : ""
                              }${
                                searchParams.category
                                  ? `&category=${searchParams.category}`
                                  : ""
                              }${
                                searchParams.minPrice
                                  ? `&minPrice=${searchParams.minPrice}`
                                  : ""
                              }${
                                searchParams.maxPrice
                                  ? `&maxPrice=${searchParams.maxPrice}`
                                  : ""
                              }${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                      {currentPage < pages && (
                        <PaginationItem>
                          <PaginationNext
                            href={`/shop?page=${currentPage + 1}${
                              searchParams.sort
                                ? `&sort=${searchParams.sort}`
                                : ""
                            }${
                              searchParams.category
                                ? `&category=${searchParams.category}`
                                : ""
                            }${
                              searchParams.minPrice
                                ? `&minPrice=${searchParams.minPrice}`
                                : ""
                            }${
                              searchParams.maxPrice
                                ? `&maxPrice=${searchParams.maxPrice}`
                                : ""
                            }${searchParams.q ? `&q=${searchParams.q}` : ""}`}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function ProductGridSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 rounded-lg border p-4">
          <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </>
  );
}
