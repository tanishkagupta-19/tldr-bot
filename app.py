import uvicorn
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__),'backend'))
if __name__=="__main__":
    uvicorn.run("backend.main:app",host="0.0.0.0",port=8000,reload=True)
