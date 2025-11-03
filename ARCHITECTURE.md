# Snapconnect - High Level Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT/BROWSER                          │
│  (User interacts with web pages via HTTP requests)              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests/Responses
                            │ (GET, POST)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                             │
│                      (index.js)                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Middleware Stack:                                        │  │
│  │  • express.urlencoded() - Parse form data                │  │
│  │  • cookie-parser() - Parse cookies                       │  │
│  │  • express.static() - Serve static files (commented)     │  │
│  │  • express-ejs-layouts() - Layouts (commented)           │  │
│  │  • passport.initialize() - Auth (not yet wired)          │  │
│  │  • passport.session() - Session auth (not yet wired)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ View Engine: EJS                                         │  │
│  │ Views Directory: ./views                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Routes
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROUTING LAYER                             │
│                      (routes/index.js)                          │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   /             │  │   /users        │  │   /posts        │ │
│  │   (Home)        │  │   (Users Router)│  │   (Posts Router)│ │
│  │                 │  │                 │  │   (Not Mounted) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  Routes Files:                                                   │
│  • routes/index.js → Main router                                │
│  • routes/users.js → User-related routes                        │
│  • routes/posts.js → Post-related routes                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Controller Functions
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                             │
│                    (Business Logic)                              │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ home_controller │  │ users_controller│  │posts_controller │ │
│  │                 │  │                 │  │                 │ │
│  │ • home()        │  │ • profile()      │  │ • create()      │ │
│  │                 │  │ • usersignup()   │  │                 │ │
│  │                 │  │ • usersignin()  │  │                 │ │
│  │                 │  │ • create()      │  │                 │ │
│  │                 │  │ • createsession()│ │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Database Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MODEL LAYER                                │
│                    (Mongoose Models)                             │
│                                                                   │
│  ┌─────────────────┐              ┌─────────────────┐          │
│  │   User Model    │              │   Post Model   │          │
│  │                 │              │                 │          │
│  │ • email         │              │ • content       │          │
│  │ • password      │              │ • user (ref)    │          │
│  │ • name          │              │ • timestamps    │          │
│  │ • timestamps    │              │                 │          │
│  └─────────────────┘              └─────────────────┘          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Mongoose Queries
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                               │
│                    MongoDB Database                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MongoDB Collections:                                   │  │
│  │  • users                                                 │  │
│  │  • posts                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Connection: Mongoose via config/mongoose.js                     │
│  URI: process.env.MONGODB_URI                                    │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION LAYER                          │
│                                                                   │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐ │
│  │  config/mongoose.js     │  │ config/passport-local-       │ │
│  │                         │  │   strategy.js                │ │
│  │  • DB Connection        │  │                             │ │
│  │  • Connection Events    │  │  • Local Strategy           │ │
│  │  • Error Handling       │  │  • serializeUser()           │ │
│  │                         │  │  • deserializeUser()        │ │
│  │                         │  │  • checkAuthentication()     │ │
│  │                         │  │  • setAuthenticatedUser()   │ │
│  └─────────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      VIEW LAYER                                  │
│                      (EJS Templates)                             │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ layout.ejs      │  │ _header.ejs     │  │ _footer.ejs     │ │
│  │ (Base Layout)   │  │ (Partial)        │  │ (Partial)        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ home.ejs        │  │user_profile.ejs │  │user_sign_in.ejs │ │
│  │                 │  │                 │  │user_sign_up.ejs │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    STATIC ASSETS                                │
│                    (Currently Disabled)                          │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ header.scss     │  │ footer.scss     │  │ layout.scss     │ │
│  │                 │  │ user_profile.scss│  │                 │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  Note: SCSS compilation and static serving are commented out     │
└─────────────────────────────────────────────────────────────────┘
```











