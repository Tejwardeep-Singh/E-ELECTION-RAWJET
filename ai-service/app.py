from fastapi import FastAPI

from routers.enrollment import router as enrollment_router

app = FastAPI(title='Bharat Ballot AI Service', version='1.0.0')


@app.get('/health')
def health_check():
    return {'status': 'ok'}


app.include_router(enrollment_router)
