def is_valid(llm_data, role, location, exp):
    candidate_exp = llm_data.get("experience", 0)
    candidate_score = llm_data.get("score", 0)
    
    role_lower = role.lower()
    if "intern" in role_lower:
        return candidate_score >= 5
    
    if candidate_exp < exp:
        return False
    
    return True