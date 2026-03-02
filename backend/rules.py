def apply_rules(data: dict):
    score = 0
    flags = []

    if data['amount'] > 10000:
        score += 25
        flags.append("High amount")

    if data['hour'] < 5:
        score += 20
        flags.append("Unusual time (night)")

    if data['location_match'] == 0:
        score += 30
        flags.append("Location mismatch")

    if data['device_match'] == 0:
        score += 15
        flags.append("Unknown device")

    if data['failed_attempts'] >= 3:
        score += 10
        flags.append("Multiple failed attempts")

    return {
        "rule_score": min(score, 100),
        "flags": flags
    }