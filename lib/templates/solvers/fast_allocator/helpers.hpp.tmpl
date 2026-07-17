class FastAllocatorArena {
 public:
  explicit FastAllocatorArena(std::size_t capacity_bytes = 0)
      : storage_(capacity_bytes), offset_(capacity_bytes) {}

  void reset() { offset_ = storage_.size(); }

  void reset(std::size_t capacity_bytes) {
    storage_.assign(capacity_bytes, 0U);
    offset_ = capacity_bytes;
  }

  std::size_t capacity() const { return storage_.size(); }

  std::size_t remaining() const { return offset_; }

  void* allocate(std::size_t bytes,
                 std::size_t alignment = alignof(std::max_align_t)) {
    if (bytes == 0) {
      return nullptr;
    }
    if (alignment == 0 || (alignment & (alignment - 1)) != 0) {
      throw std::bad_alloc();
    }
    if (bytes > offset_) {
      throw std::bad_alloc();
    }

    std::size_t pos = offset_ - bytes;
    pos &= ~(alignment - 1);
    if (pos > offset_ || offset_ - pos < bytes) {
      throw std::bad_alloc();
    }

    offset_ = pos;
    return static_cast<void*>(storage_.data() + offset_);
  }

 private:
  std::vector<unsigned char> storage_;
  std::size_t offset_;
};

template <typename T>
class FastAllocator {
 public:
  using value_type = T;

  FastAllocator() noexcept : arena_(nullptr) {}

  explicit FastAllocator(FastAllocatorArena& arena) noexcept : arena_(&arena) {}

  template <typename U>
  FastAllocator(const FastAllocator<U>& other) noexcept : arena_(other.arena()) {}

  T* allocate(std::size_t n) {
    if (n == 0) {
      return nullptr;
    }
    if (arena_ == nullptr ||
        n > std::numeric_limits<std::size_t>::max() / sizeof(T)) {
      throw std::bad_alloc();
    }
    return static_cast<T*>(arena_->allocate(n * sizeof(T), alignof(T)));
  }

  void deallocate(T*, std::size_t) noexcept {}

  template <typename U>
  struct rebind {
    using other = FastAllocator<U>;
  };

  FastAllocatorArena* arena() const noexcept { return arena_; }

  template <typename U>
  bool operator==(const FastAllocator<U>& other) const noexcept {
    return arena_ == other.arena();
  }

  template <typename U>
  bool operator!=(const FastAllocator<U>& other) const noexcept {
    return !(*this == other);
  }

 private:
  template <typename>
  friend class FastAllocator;

  FastAllocatorArena* arena_;
};

template <typename T>
inline FastAllocator<T> make_fast_allocator(FastAllocatorArena& arena) {
  return FastAllocator<T>(arena);
}
