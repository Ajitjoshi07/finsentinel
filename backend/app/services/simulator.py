"""
Transaction Simulator
Generates realistic synthetic transactions for demos
"""
import random
import math
from datetime import datetime
from typing import Dict, Any

MERCHANTS = {
    "grocery": [
        "Whole Foods Market", "Kroger", "Safeway", "Trader Joe's",
        "Walmart Grocery", "Target", "Aldi", "Publix"
    ],
    "dining": [
        "McDonald's", "Starbucks", "Chipotle", "Subway",
        "Domino's Pizza", "The Cheesecake Factory", "Olive Garden", "Panera Bread"
    ],
    "travel": [
        "Delta Airlines", "Marriott Hotels", "United Airlines",
        "Airbnb", "Hilton Hotels", "Hertz Car Rental", "Expedia", "Booking.com"
    ],
    "entertainment": [
        "Netflix", "Spotify", "AMC Theaters", "Steam Games",
        "PlayStation Store", "Apple iTunes", "Ticketmaster"
    ],
    "retail": [
        "Amazon", "Best Buy", "Nike", "Zara",
        "H&M", "Gap", "Macy's", "IKEA"
    ],
    "online": [
        "PayPal Transfer", "Etsy", "eBay", "Shopify Store",
        "AliExpress", "Wish", "Shein"
    ],
    "atm": [
        "Chase ATM", "Bank of America ATM", "Wells Fargo ATM",
        "Citibank ATM", "7-Eleven ATM"
    ],
    "transfer": [
        "Venmo Transfer", "Cash App", "Zelle Payment",
        "Wire Transfer", "ACH Transfer"
    ],
    "utility": [
        "ComEd Electric", "AT&T Mobile", "Comcast Xfinity",
        "Verizon Wireless", "PG&E Energy"
    ],
    "healthcare": [
        "CVS Pharmacy", "Walgreens", "UnitedHealth", "Blue Cross",
        "Mayo Clinic", "Kaiser Permanente"
    ],
}

CITIES = [
    ("New York", "US", 40.7128, -74.0060),
    ("Los Angeles", "US", 34.0522, -118.2437),
    ("Chicago", "US", 41.8781, -87.6298),
    ("Houston", "US", 29.7604, -95.3698),
    ("Miami", "US", 25.7617, -80.1918),
    ("San Francisco", "US", 37.7749, -122.4194),
    ("London", "GB", 51.5074, -0.1278),
    ("Paris", "FR", 48.8566, 2.3522),
    ("Tokyo", "JP", 35.6762, 139.6503),
    ("Dubai", "AE", 25.2048, 55.2708),
    ("Mumbai", "IN", 19.0760, 72.8777),
    ("Singapore", "SG", 1.3521, 103.8198),
    ("Sydney", "AU", -33.8688, 151.2093),
    ("Toronto", "CA", 43.6532, -79.3832),
    ("Berlin", "DE", 52.5200, 13.4050),
]

CARDS = [
    ("4532", "411111"), ("7823", "543210"), ("1099", "601100"),
    ("3341", "378282"), ("5678", "520000"), ("2244", "490000"),
    ("9901", "356600"), ("4411", "400000"), ("6622", "445670"),
    ("8833", "510000"),
]


def haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1-a))


def generate_transaction(scenario: str = "random") -> Dict[str, Any]:
    now = datetime.utcnow()
    hour = now.hour

    card = random.choice(CARDS)
    home_city = random.choice(CITIES[:6])  # US cities as home
    txn_city = random.choice(CITIES)

    geo_dist = haversine(
        home_city[2], home_city[3],
        txn_city[2], txn_city[3]
    )

    category = random.choice(list(MERCHANTS.keys()))
    merchant = random.choice(MERCHANTS[category])

    cross_border = txn_city[1] != "US"

    if scenario == "high_fraud":
        amount = random.choice([
            round(random.uniform(0.01, 1.99), 2),
            round(random.uniform(800, 5000), 2),
        ])
        merchant_risk = round(random.uniform(0.65, 0.99), 3)
        velocity_1h = random.randint(3, 8)
        velocity_24h = random.randint(10, 20)
        geo_dist = random.uniform(2000, 15000)
        is_new_merchant = True
        cross_border = True
        txn_city = random.choice(CITIES[6:])  # foreign city
    elif scenario == "normal":
        amount = round(random.lognormvariate(3.5, 0.8), 2)
        merchant_risk = round(random.uniform(0.01, 0.25), 3)
        velocity_1h = random.randint(0, 1)
        velocity_24h = random.randint(1, 5)
        geo_dist = random.uniform(0, 80)
        is_new_merchant = random.random() < 0.1
        txn_city = home_city
        cross_border = False
    elif scenario == "burst":
        amount = round(random.uniform(50, 500), 2)
        merchant_risk = round(random.uniform(0.2, 0.6), 3)
        velocity_1h = random.randint(4, 10)
        velocity_24h = random.randint(15, 30)
        geo_dist = random.uniform(0, 200)
        is_new_merchant = random.random() < 0.4
    else:
        # Weighted random: 15% fraud-ish, 85% normal-ish
        if random.random() < 0.15:
            amount = random.choice([
                round(random.uniform(0.5, 2.0), 2),
                round(random.uniform(500, 3000), 2),
                round(random.lognormvariate(4.0, 1.2), 2),
            ])
            merchant_risk = round(random.uniform(0.3, 0.9), 3)
            velocity_1h = random.randint(1, 6)
            velocity_24h = random.randint(3, 15)
            geo_dist = random.uniform(100, 8000)
            is_new_merchant = random.random() < 0.6
        else:
            amount = round(max(0.5, random.lognormvariate(3.2, 0.9)), 2)
            merchant_risk = round(random.uniform(0.01, 0.30), 3)
            velocity_1h = random.randint(0, 2)
            velocity_24h = random.randint(1, 6)
            geo_dist = random.uniform(0, 100)
            is_new_merchant = random.random() < 0.1
            txn_city = home_city
            cross_border = False

    device_age = round(random.lognormvariate(5.0, 1.5), 0)
    device_age = max(1, min(3650, device_age))

    return {
        "card_last4": card[0],
        "card_bin": card[1],
        "merchant_name": merchant,
        "merchant_category": category,
        "merchant_country": txn_city[1],
        "amount": round(max(0.01, amount), 2),
        "currency": "USD",
        "lat": txn_city[2],
        "lng": txn_city[3],
        "city": txn_city[0],
        "country": txn_city[1],
        "geo_distance_km": round(geo_dist, 1),
        "hour": hour,
        "velocity_1h": velocity_1h,
        "velocity_24h": velocity_24h,
        "is_new_merchant": is_new_merchant,
        "cross_border": cross_border,
        "device_age_days": device_age,
        "merchant_risk_score": merchant_risk,
    }
