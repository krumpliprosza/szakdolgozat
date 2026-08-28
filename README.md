```sh
pip freeze > requirements.txt
# Elso inditas elott
# Backend (venv hasznalata ajanlott):
pip install -r requirements.txt

# Frontend:
cd frontend
npm install
```

```sh
# Minden inditas elott
# Backend:
cd backend
fastapi dev

# Frontend:
cd frontend
npm run dev
```