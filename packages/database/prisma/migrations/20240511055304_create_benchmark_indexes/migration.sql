-- CreateIndex
CREATE INDEX "product_benchmarks_benchmarkKey_value_index" ON "product_benchmarks"("benchmark_key", "value");

-- CreateIndex
CREATE INDEX "product_benchmarks_benchmarkKey_valuePerMsrp_index" ON "product_benchmarks"("benchmark_key", "value_per_msrp");
