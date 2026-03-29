CXX ?= g++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Wextra -pedantic

TEST_SRCS := $(sort $(wildcard tests/*_test.cpp))
TEST_BIN_DIR := .test-bin

.PHONY: test clean
.NOTPARALLEL: test

test:
	@mkdir -p $(TEST_BIN_DIR)
	@set -e; \
	for src in $(TEST_SRCS); do \
		name=$$(basename "$$src" .cpp); \
		bin="$(TEST_BIN_DIR)/$$name"; \
		echo "==> $$name"; \
		$(CXX) $(CXXFLAGS) "$$src" -o "$$bin"; \
		"$$bin"; \
	done

clean:
	rm -rf $(TEST_BIN_DIR)
