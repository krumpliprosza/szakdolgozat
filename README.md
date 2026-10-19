# Napelemrendszer szimulátor

## A beüzemelés menete

### A legelső indítás előtt

Terminálban (root mappából kiindulva):

```sh
# Frontend eseten:
cd frontend
npm install

# Backend eseten:
cd backend
python -m venv .venv
# Windows eseten: .venv\Scripts\activate
# macOS/Linux eseten: source .venv/bin/activate
pip install -r requirements.txt
```

> [!WARNING]
> Mind a frontend, mind a backend mappa esetén készíts egy-egy .env fájlt! A kitöltésükhöz szükséges formátumot a mappákban megtalálható .env.example fájlok adják.

### Minden indítás előtt

Terminálban (root mappából kiindulva):

```sh
# Frontend eseten:
cd frontend
npm run dev

# Backend eseten:
cd backend
fastapi dev
```

> [!WARNING]
> Az előbb felsorolt parancsokat két külön terminálban futtasd, mivel a maguk terminálját lefoglalva fogják tartani!