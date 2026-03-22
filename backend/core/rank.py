def rank_candidates(candidates: list) -> list:
    return sorted(
        candidates,
        key=lambda x: x.get("score", 0),
        reverse=True
    )