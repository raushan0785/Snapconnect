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

## Request Flow Examples

### Example 1: User Visits Home Page
```
Browser → GET / 
       → Express Server (index.js)
       → routes/index.js → router.get('/', ...)
       → home_controller.home()
       → res.render('home', { title: 'home' })
       → views/home.ejs rendered
       → HTML sent to browser
```

### Example 2: User Signs Up
```
Browser → POST /users/create
       → Express Server (index.js)
       → routes/index.js → router.use('/users', ...)
       → routes/users.js → router.post('/create', ...)
       → users_controller.create()
       → User.findOne() [Check if exists]
       → User.create() [Create new user]
       → MongoDB saves user document
       → res.redirect('/users/sign-in')
       → Browser redirects to sign-in page
```

### Example 3: User Signs In
```
Browser → POST /users/create-session
       → Express Server (index.js)
       → routes/users.js → router.post('/create-session', ...)
       → users_controller.createsession()
       → User.findOne({ email }) [Find user]
       → Password comparison (plaintext - needs bcrypt)
       → res.cookie('user_id', user.id) [Set cookie]
       → res.redirect('/users/profile')
       → Browser redirects to profile
```

### Example 4: View Profile (Authenticated)
```
Browser → GET /users/profile
       → Express Server
       → routes/users.js → router.get('/profile', ...)
       → users_controller.profile()
       → Check req.cookies.user_id
       → User.findById(user_id) [Fetch user]
       → MongoDB returns user document
       → res.render('user_profile', { user })
       → views/user_profile.ejs rendered with user data
       → HTML sent to browser
```

## Component Interactions

### Authentication Flow (Current vs Ideal)
```
CURRENT:
Browser → createsession() → Manual cookie (user_id)
       → profile() → Read cookie → Fetch user

IDEAL (With Passport):
Browser → passport.authenticate('local')
       → serializeUser() → Session stored in MongoDB
       → deserializeUser() → req.user populated
       → checkAuthentication() → Protect routes
       → setAuthenticatedUser() → res.locals.user
```

### Database Relationships
```
User Model ────┐
              │
              │ (Reference via ObjectId)
              │
              ▼
Post Model
  • user: ObjectId → Points to User._id
```

## Environment Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT VARIABLES                        │
│                                                                   │
│  Local (.env file):              Production (Render):            │
│  • PORT=8000                     • PORT (auto-injected)        │
│  • MONGODB_URI=localhost...       • MONGODB_URI (Atlas)         │
│  • SESSION_SECRET=dev_secret      • SESSION_SECRET              │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                             │
│                                                                   │
│  Backend:         • Node.js                                      │
│                   • Express.js (Web Framework)                   │
│                   • Mongoose (ODM)                               │
│                   • Passport.js (Auth - configured, not wired)  │
│                                                                   │
│  Database:        • MongoDB                                      │
│                                                                   │
│  Template Engine: • EJS (Embedded JavaScript)                   │
│                                                                   │
│  Frontend:        • HTML                                         │
│                   • CSS/SCSS (currently disabled)                │
│                                                                   │
│  Configuration:   • dotenv                                       │
│                                                                   │
│  Session Store:   • connect-mongo (installed, not configured)   │
│                   • express-session (installed, not configured) │
└─────────────────────────────────────────────────────────────────┘
```

## Current Architecture Status

### ✅ Implemented
- Basic MVC structure
- Express routing
- Mongoose models (User, Post)
- EJS views with partials
- Cookie-based authentication (temporary)
- Environment configuration (dotenv)
- MongoDB connection

### ⚠️ Partially Implemented
- Passport strategy defined but not wired
- SCSS files exist but not compiled
- Static assets middleware commented out
- Layout system commented out

### ❌ Not Implemented
- Session-based authentication
- Password hashing (bcrypt)
- Route protection middleware
- Posts router mounting
- Error handling middleware
- Input validation
- CSRF protection








