def parse_page_list(value: str):
    """
    Parse page input like:
      "1" -> [1]
      "1,2,5" -> [1,2,5]
      "1-3,5" -> [1,2,3,5]
      " 1 , 3-4 " -> [1,3,4]

    Raises ValueError on invalid tokens.
    """
    if value is None or str(value).strip() == "":
        return []

    pages = set()
    for part in str(value).split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            try:
                start_s, end_s = part.split("-", 1)
                start = int(start_s)
                end = int(end_s)
            except Exception:
                raise ValueError(f"Invalid page range: {part}")
            if start > end or start < 1:
                raise ValueError(f"Invalid page range: {part}")
            for p in range(start, end + 1):
                pages.add(p)
        else:
            try:
                p = int(part)
            except Exception:
                raise ValueError(f"Invalid page number: {part}")
            if p < 1:
                raise ValueError(f"Invalid page number: {part}")
            pages.add(p)
    return sorted(pages)
